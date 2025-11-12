import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MODELS_DIR = path.join(__dirname, '../../data/models')

/**
 * Ensure models directory exists
 */
async function ensureModelsDir() {
  try {
    await fs.access(MODELS_DIR)
  } catch {
    await fs.mkdir(MODELS_DIR, { recursive: true })
  }
}

/**
 * Save model to disk
 */
export async function saveModel(modelName, modelData) {
  try {
    await ensureModelsDir()
    
    const modelPath = path.join(MODELS_DIR, `${modelName}.json`)
    const data = {
      ...modelData,
      savedAt: new Date().toISOString(),
      version: '1.0.0'
    }
    
    await fs.writeFile(modelPath, JSON.stringify(data, null, 2))
    
    return { success: true, path: modelPath }
  } catch (error) {
    throw new Error(`Failed to save model: ${error.message}`)
  }
}

/**
 * Load model from disk
 */
export async function loadModel(modelName) {
  try {
    const modelPath = path.join(MODELS_DIR, `${modelName}.json`)
    const data = await fs.readFile(modelPath, 'utf-8')
    
    return JSON.parse(data)
  } catch (error) {
    throw new Error(`Failed to load model: ${error.message}`)
  }
}

/**
 * List all saved models
 */
export async function listModels() {
  try {
    await ensureModelsDir()
    const files = await fs.readdir(MODELS_DIR)
    
    const models = []
    for (const file of files) {
      if (file.endsWith('.json')) {
        const modelPath = path.join(MODELS_DIR, file)
        const stats = await fs.stat(modelPath)
        models.push({
          name: file.replace('.json', ''),
          size: stats.size,
          modified: stats.mtime
        })
      }
    }
    
    return models
  } catch (error) {
    throw new Error(`Failed to list models: ${error.message}`)
  }
}

/**
 * Delete a model
 */
export async function deleteModel(modelName) {
  try {
    const modelPath = path.join(MODELS_DIR, `${modelName}.json`)
    await fs.unlink(modelPath)
    
    return { success: true }
  } catch (error) {
    throw new Error(`Failed to delete model: ${error.message}`)
  }
}
