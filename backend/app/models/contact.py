from pydantic import BaseModel

class ContactFormModel(BaseModel):
    name: str
    mobile_no: str
    problem: str
