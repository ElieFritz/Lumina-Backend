const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Configuration MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://lumina_db@luminadb.w1m6nyq.mongodb.net/lumina_db_user?retryWrites=true&w=majority';
const DATABASE_NAME = 'luminadb';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runMigration() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    log('🚀 Démarrage de la migration MongoDB Atlas...', 'cyan');
    
    // Connexion à MongoDB Atlas
    await client.connect();
    log('✅ Connecté à MongoDB Atlas', 'green');
    
    const db = client.db(DATABASE_NAME);
    
    // Vérifier si la base de données existe
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    const dbExists = databases.databases.some(db => db.name === DATABASE_NAME);
    
    if (dbExists) {
      log(`ℹ️  Base de données ${DATABASE_NAME} existe déjà`, 'yellow');
    } else {
      log(`✅ Base de données ${DATABASE_NAME} créée`, 'green');
    }
    
    // Créer les collections
    const collections = ['users', 'venues', 'events', 'reviews', 'reservations', 'payments'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        log(`✅ Collection ${collectionName} créée`, 'green');
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          log(`ℹ️  Collection ${collectionName} existe déjà`, 'yellow');
        } else {
          throw error;
        }
      }
    }
    
    // Créer les index
    log('📊 Création des index...', 'blue');
    
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      log('✅ Index unique sur users.email créé', 'green');
    } catch (error) {
      if (error.code === 11000) {
        log('ℹ️  Index unique sur users.email existe déjà', 'yellow');
      } else {
        throw error;
      }
    }
    
    try {
      await db.collection('venues').createIndex({ coordinates: '2dsphere' });
      log('✅ Index géospatial sur venues.coordinates créé', 'green');
    } catch (error) {
      log('ℹ️  Index géospatial sur venues.coordinates existe déjà', 'yellow');
    }
    
    try {
      await db.collection('events').createIndex({ startDate: 1 });
      await db.collection('events').createIndex({ venueId: 1 });
      log('✅ Index sur events créés', 'green');
    } catch (error) {
      log('ℹ️  Index sur events existent déjà', 'yellow');
    }
    
    try {
      await db.collection('reviews').createIndex({ venueId: 1 });
      await db.collection('reviews').createIndex({ eventId: 1 });
      log('✅ Index sur reviews créés', 'green');
    } catch (error) {
      log('ℹ️  Index sur reviews existent déjà', 'yellow');
    }
    
    try {
      await db.collection('reservations').createIndex({ userId: 1 });
      await db.collection('reservations').createIndex({ venueId: 1 });
      log('✅ Index sur reservations créés', 'green');
    } catch (error) {
      log('ℹ️  Index sur reservations existent déjà', 'yellow');
    }
    
    try {
      await db.collection('payments').createIndex({ userId: 1 });
      await db.collection('payments').createIndex({ transactionId: 1 }, { unique: true });
      log('✅ Index sur payments créés', 'green');
    } catch (error) {
      if (error.code === 11000) {
        log('ℹ️  Index sur payments existent déjà', 'yellow');
      } else {
        throw error;
      }
    }
    
    // Charger et insérer les données d'initialisation
    log(' Chargement des données d\'initialisation...', 'blue');
    
    const initDataPath = path.join(__dirname, 'mongodb-init.json');
    
    if (!fs.existsSync(initDataPath)) {
      log('❌ Fichier mongodb-init.json non trouvé', 'red');
      log('💡 Créez le fichier mongodb-init.json avec vos données', 'yellow');
      return;
    }
    
    const initData = JSON.parse(fs.readFileSync(initDataPath, 'utf8'));
    
    for (const [collectionName, documents] of Object.entries(initData)) {
      if (documents && documents.length > 0) {
        try {
          // Vérifier si des documents existent déjà
          const existingCount = await db.collection(collectionName).countDocuments();
          
          if (existingCount > 0) {
            log(`ℹ️  ${existingCount} documents existent déjà dans ${collectionName}`, 'yellow');
            log(`💡 Voulez-vous vider la collection ${collectionName} ? (y/N)`, 'cyan');
            
            // Pour l'automatisation, on skip les collections existantes
            continue;
          }
          
          await db.collection(collectionName).insertMany(documents);
          log(`✅ ${documents.length} documents insérés dans ${collectionName}`, 'green');
        } catch (error) {
          if (error.code === 11000) {
            log(`ℹ️  Certains documents existent déjà dans ${collectionName}`, 'yellow');
          } else {
            throw error;
          }
        }
      }
    }
    
    // Vérification finale
    log('🔍 Vérification finale...', 'blue');
    
    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      log(`📊 ${collectionName}: ${count} documents`, 'magenta');
    }
    
    log('🎉 Migration terminée avec succès !', 'green');
    log('🌍 Votre base de données MongoDB Atlas est prête !', 'cyan');
    
  } catch (error) {
    log('❌ Erreur lors de la migration:', 'red');
    log(error.message, 'red');
    
    if (error.message.includes('authentication failed')) {
      log('💡 Vérifiez votre nom d\'utilisateur et mot de passe MongoDB', 'yellow');
    } else if (error.message.includes('network')) {
      log('💡 Vérifiez votre connexion internet et l\'IP autorisée dans MongoDB Atlas', 'yellow');
    }
  } finally {
    await client.close();
    log('🔌 Connexion fermée', 'blue');
  }
}

// Fonction pour vider une collection (optionnel)
async function clearCollection(collectionName) {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    
    const result = await db.collection(collectionName).deleteMany({});
    log(`️  ${result.deletedCount} documents supprimés de ${collectionName}`, 'yellow');
  } catch (error) {
    log(`❌ Erreur lors de la suppression de ${collectionName}:`, 'red');
    log(error.message, 'red');
  } finally {
    await client.close();
  }
}

// Exécution du script
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'clear' && args[1]) {
    clearCollection(args[1]);
  } else {
    runMigration();
  }
}

module.exports = { runMigration, clearCollection };
