import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'admin-settings.json');
const productsFile = path.join(dataDir, 'products.json');

const defaultCredentials = {
  email: 'admin@vasukipickles.com',
  password: 'Admin@123',
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultCredentials, null, 2), 'utf8');
  }

  try {
    await fs.access(productsFile);
  } catch {
    await fs.writeFile(productsFile, JSON.stringify([], null, 2), 'utf8');
  }
}

async function readCredentials() {
  await ensureStore();
  const raw = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(raw);
}

async function writeCredentials(nextState) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(nextState, null, 2), 'utf8');
  return nextState;
}

async function readProducts() {
  await ensureStore();
  const raw = await fs.readFile(productsFile, 'utf8');
  return JSON.parse(raw);
}

async function writeProducts(nextProducts) {
  await ensureStore();
  await fs.writeFile(productsFile, JSON.stringify(nextProducts, null, 2), 'utf8');
  return nextProducts;
}

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/admin-credentials', async (_req, res) => {
  try {
    const credentials = await readCredentials();
    res.json(credentials);
  } catch (error) {
    console.error('Failed to read admin credentials:', error);
    res.status(500).json({ error: 'Unable to read admin credentials.' });
  }
});

app.post('/api/admin-credentials/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    const credentials = await readCredentials();

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'A valid current password and a new password of at least 6 characters are required.' });
    }

    if (currentPassword !== credentials.password) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const updated = await writeCredentials({ ...credentials, password: newPassword });
    res.json(updated);
  } catch (error) {
    console.error('Failed to update admin password:', error);
    res.status(500).json({ error: 'Unable to update admin password.' });
  }
});

app.post('/api/admin-credentials/email', async (req, res) => {
  try {
    const { currentPassword, newEmail } = req.body || {};
    const credentials = await readCredentials();

    if (!currentPassword || !newEmail || !newEmail.includes('@')) {
      return res.status(400).json({ error: 'A valid current password and a new email address are required.' });
    }

    if (currentPassword !== credentials.password) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const updated = await writeCredentials({ ...credentials, email: newEmail });
    res.json(updated);
  } catch (error) {
    console.error('Failed to update admin email:', error);
    res.status(500).json({ error: 'Unable to update admin email.' });
  }
});

app.get('/api/products', async (_req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    console.error('Failed to read products:', error);
    res.status(500).json({ error: 'Unable to read products.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find((item) => item.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Failed to read product:', error);
    res.status(500).json({ error: 'Unable to read product.' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = req.body || {};
    if (!product.name) {
      return res.status(400).json({ error: 'Product name is required.' });
    }

    const products = await readProducts();
    const nextProduct = {
      ...product,
      id: product.id || Date.now().toString(),
      visible: product.visible !== undefined ? product.visible : true,
      inStock: product.inStock !== undefined ? product.inStock : Number(product.stockQuantity) > 0,
      stockQuantity: Number(product.stockQuantity) || 0,
    };

    products.push(nextProduct);
    await writeProducts(products);
    res.json(nextProduct);
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: 'Unable to create product.' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const productUpdates = req.body || {};
    const products = await readProducts();
    const index = products.findIndex((item) => item.id === req.params.id);
    if (index < 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const updatedProduct = {
      ...products[index],
      ...productUpdates,
      id: req.params.id,
      stockQuantity: Number(productUpdates.stockQuantity ?? products[index].stockQuantity),
      inStock: productUpdates.inStock !== undefined ? productUpdates.inStock : Number(productUpdates.stockQuantity ?? products[index].stockQuantity) > 0,
    };

    products[index] = updatedProduct;
    await writeProducts(products);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ error: 'Unable to update product.' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const updatedProducts = products.filter((item) => item.id !== req.params.id);
    await writeProducts(updatedProducts);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ error: 'Unable to delete product.' });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`Admin auth server listening on http://localhost:${port}`);
});
