import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any, List

class DataService:
    @staticmethod
    def load_data(file_path: str) -> pd.DataFrame:
        try:
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            elif file_path.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file_path)
            else:
                raise ValueError("Unsupported file format")
            
            # Basic cleanup: drop completely empty rows and columns
            df = df.dropna(how='all', axis=0).dropna(how='all', axis=1)
            # Trim column names
            df.columns = [str(c).strip() for c in df.columns]
            return df
        except Exception as e:
            print(f"Error loading data: {e}")
            raise e

    @staticmethod
    def get_column_names(df: pd.DataFrame) -> List[str]:
        # Filter out 'Unnamed' columns
        return [c for c in df.columns if not c.startswith('Unnamed:')]

    @staticmethod
    def analyze_data(df: pd.DataFrame, mapping: Dict[str, str]) -> Dict[str, Any]:
        # Identify core vs dynamic fields
        core_fields = ['date', 'product', 'quantity', 'price', 'cost']
        dynamic_fields = [k for k in mapping.keys() if k not in core_fields]

        # Rename columns based on mapping
        rev_mapping = {v: k for k, v in mapping.items()}
        df = df.rename(columns=rev_mapping)

        # Basic cleaning with more tolerance
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df = df.dropna(subset=['date'])
        
        df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce').fillna(0)
        df['price'] = pd.to_numeric(df['price'], errors='coerce').fillna(0)
        df['total_sales'] = df['quantity'] * df['price']
        
        if 'cost' in df.columns:
            df['cost'] = pd.to_numeric(df['cost'], errors='coerce').fillna(0)
            df['total_profit'] = df['total_sales'] - (df['quantity'] * df['cost'])
        else:
            df['total_profit'] = 0

        # Dynamic Breakdowns
        categorical_breakdowns = {}
        for field in dynamic_fields:
            if field in df.columns:
                # Group by the custom field and sum sales
                breakdown = df.groupby(field)['total_sales'].sum().reset_index()
                breakdown.columns = ['name', 'value']
                categorical_breakdowns[field] = breakdown.to_dict('records')

        # Summary Computations
        summary = {
            "total_sales_value": round(float(df['total_sales'].sum()), 2),
            "total_profit_value": round(float(df['total_profit'].sum()), 2),
            "total_transactions": len(df),
            "top_products": df.groupby('product')['total_sales'].sum().sort_values(ascending=False).head(5).to_dict(),
            "monthly_trends": df.resample('ME', on='date')['total_sales'].sum().reset_index().to_dict('records'),
            "categorical_breakdowns": categorical_breakdowns
        }
        
        # Convert datetime to string for JSON serialization
        for trend in summary['monthly_trends']:
            if isinstance(trend['date'], (pd.Timestamp, datetime)):
                trend['date'] = trend['date'].strftime('%Y-%m')
            trend['total_sales'] = round(float(trend['total_sales']), 2)

        return summary
