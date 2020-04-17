const APP_CONFIG = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '28015',
  DB_USERNAME: process.env.DB_USERNAME || 'devpunk',
  DB_PASSWORD: process.env.DB_PASSWORD || 'devpunk_pwd',
  DB_NAME: process.env.DB_NAME || 'dev_punk',
  RPP: process.env.RESULT_PER_PAGE || 30,
  DATA_PATH:
    process.env.DATA_PATH || '/Users/reezpatel/Documents/personal/devpunk',
  DATA_FOLDER: process.env.DATA_FOLDER || 'devpunk_static'
};

export { APP_CONFIG };
