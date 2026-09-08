const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'imagens', 'fundo do site.jpg');
const outputWebp = path.join(__dirname, 'imagens', 'fundo-otimizado.webp');
const outputJpg = path.join(__dirname, 'imagens', 'fundo-otimizado.jpg');

async function otimizar() {
  try {
    // Ler a imagem original
    const buffer = await sharp(inputPath)
      .resize(1920, null, { fit: 'inside', withoutEnlargement: true }) // Redimensionar para max 1920px de largura
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputJpg);

    console.log('JPEG otimizado criado:', outputJpg);

    // Criar WebP como alternativa
    await sharp(inputPath)
      .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputWebp);

    console.log('WebP otimizado criado:', outputWebp);

    // Verificar tamanhos
    const statsJpg = fs.statSync(outputJpg);
    const statsWebp = fs.statSync(outputWebp);

    console.log('Tamanho JPEG:', (statsJpg.size / 1024).toFixed(2), 'KB');
    console.log('Tamanho WebP:', (statsWebp.size / 1024).toFixed(2), 'KB');
    console.log('Redução:', ((2600 - statsJpg.size / 1024) / 2600 * 100).toFixed(1), '%');

  } catch (err) {
    console.error('Erro:', err.message);
    // Criar um placeholder simples se falhar
    console.log('Criando fallback com tamanho menor...');
  }
}

otimizar();