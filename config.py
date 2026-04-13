import os

DATABASE_PATH = os.environ.get('DATABASE_PATH', os.path.join(os.path.dirname(__file__), 'quiz.db'))
SECRET_KEY = os.environ.get('SECRET_KEY', 'wenyi-bing-secret-2024-change-in-prod')
DEBUG = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
