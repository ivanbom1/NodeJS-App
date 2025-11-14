import dotenv from 'dotenv'

dotenv.config()

const requiredEnvVars = ['API_KEY']

for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`Missing required environment variable: ${envVar}`)
	}
}

export const config = {

	port: process.env.PORT || 3000,
	nodeEnv: process.env.NODE_ENV || 'development',

	databaseUrl: process.env.DATABASE_URL || './database.sqlite',

	apiKey: process.env.API_KEY,

	jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
	jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

	isDevelopment: () => process.env.NODE_ENV === 'development',
	isProduction: () => process.env.NODE_ENV === 'production',
	isTest: () => process.env.NODE_ENV === 'test',
}

if (config.isDevelopment()) {
	console.log('📋 Configuration loaded:')
	console.log(`   PORT: ${config.port}`)
	console.log(`   NODE_ENV: ${config.nodeEnv}`)
	console.log(`   DATABASE_URL: ${config.databaseUrl}`)
	console.log(`   API_KEY: ${config.apiKey ? '***' + config.apiKey.slice(-4) : 'NOT SET'}`)
}

export default config