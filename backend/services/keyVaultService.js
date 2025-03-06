const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

// The URL of your Azure Key Vault
const keyVaultName = process.env.KEY_VAULT_NAME;
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net/`;

// Authenticate using DefaultAzureCredential
const credential = new DefaultAzureCredential();
const client = new SecretClient(keyVaultUrl, credential);

exports.getBearerToken = async (secretName) => {
  try {
    const retrievedSecret = await client.getSecret(secretName);
    return retrievedSecret.value;
  } catch (error) {
    console.error('Error fetching secret from Key Vault:', error.message);
    throw error;
  }
};
