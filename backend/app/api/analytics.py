from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os
import uuid
from ..core import database, config
from ..models import models
from ..schemas import schemas
from .deps import get_current_user
from ..services.data_service import DataService
from ..services.forecast_service import ForecastService

router = APIRouter()

@router.post("/upload", response_model=schemas.Upload)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Ensure upload directory exists
    if not os.path.exists(config.settings.UPLOAD_DIR):
        os.makedirs(config.settings.UPLOAD_DIR)

    file_extension = os.path.splitext(file.filename)[1]
    if file_extension not in ['.csv', '.xlsx', '.xls']:
        raise HTTPException(status_code=400, detail="Invalid file type")

    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(config.settings.UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_upload = models.Upload(
        filename=file.filename,
        file_path=file_path,
        user_id=current_user.id
    )
    db.add(new_upload)
    db.commit()
    db.refresh(new_upload)
    return new_upload

@router.get("/{upload_id}/columns")
def get_columns(
    upload_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    upload = db.query(models.Upload).filter(models.Upload.id == upload_id, models.Upload.user_id == current_user.id).first()
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    
    df = DataService.load_data(upload.file_path)
    return {"columns": DataService.get_column_names(df)}

@router.post("/{upload_id}/map")
def set_mapping(
    upload_id: int,
    mapping: dict,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    upload = db.query(models.Upload).filter(models.Upload.id == upload_id, models.Upload.user_id == current_user.id).first()
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    
    upload.mapping = mapping
    db.commit()
    return {"message": "Mapping saved"}

@router.get("/{upload_id}/analytics")
def get_analytics(
    upload_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    upload = db.query(models.Upload).filter(models.Upload.id == upload_id, models.Upload.user_id == current_user.id).first()
    if not upload or not upload.mapping:
        raise HTTPException(status_code=400, detail="Data or mapping missing")
    
    print(f"Starting analytics for upload {upload_id}")
    try:
        df = DataService.load_data(upload.file_path)
        print("Data loaded, columns:", df.columns.tolist())
        
        # In our implementation, analyze_data should ideally return the cleaned df
        # But for now, let's just make sure predict_sales also cleans properly
        analysis = DataService.analyze_data(df, upload.mapping)
        print("Basic analysis complete")
        
        forecast = ForecastService.predict_sales(df, upload.mapping)
        print("Forecasting complete")
        
        recommendations = ForecastService.get_recommendations(analysis)
        print("Recommendations generated")
        
        return {
            "summary": analysis,
            "forecast": forecast,
            "recommendations": recommendations
        }
    except Exception as e:
        print(f"Analytics error for upload {upload_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")
