type ConfigType = {
  port: number;
  nodeEnv: string;
}

const config: ConfigType = {
  port: Number(process.env.PORT) || 8000,
  nodeEnv: process.env.NODE_ENV || 'dev',
};

export default config;