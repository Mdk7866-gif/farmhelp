from pydantic import BaseModel

class ApplicationFormModel(BaseModel):
    name: str
    home_address: str
    mobile_no: str
