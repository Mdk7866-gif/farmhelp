from pydantic import BaseModel

class FarmerLoginModel(BaseModel):
    mobile_no: str
