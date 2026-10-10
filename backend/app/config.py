from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./roboticslab.db"
    app_name: str = "Robotics Lab Portal"
    debug: bool = False

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
