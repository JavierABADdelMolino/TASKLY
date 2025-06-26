const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Servicio para gestionar subidas a Cloudinary
 */
const cloudinaryService = {
  /**
   * Sube un archivo de avatar a Cloudinary
   * @param {Object} file - Archivo de multer (req.file)
   * @returns {Promise} - Promise con el resultado de la subida
   */
  uploadAvatar: (file) => {
    return new Promise((resolve, reject) => {
      // Crear un stream del buffer del archivo
      const stream = Readable.from(file.buffer);
      
      // Crear un stream de subida a Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "avatars",
          transformation: [
            { width: 250, height: 250, crop: "fill", gravity: "face" },
          ],
          // Metadatos para mejor organización
          public_id: `avatar_${Date.now()}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      
      // Pipe el stream del archivo al stream de cloudinary
      stream.pipe(uploadStream);
    });
  },

  /**
   * Elimina un archivo de Cloudinary por su public_id
   * @param {String} publicId - ID público de Cloudinary
   * @returns {Promise}
   */
  deleteImage: async (publicId) => {
    try {
      return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al eliminar imagen de Cloudinary:', error);
      throw error;
    }
  }
};

module.exports = cloudinaryService;
