import Joi from "joi";

const signUpSchema = Joi.object({
  mail: Joi.string().email().required().messages({
    "string.base": `"mail" debe ser una cadena de texto`,
    "string.email": `"mail" debe ser un correo electrónico válido`,
    "any.required": `"mail" es un campo obligatorio`,
    "string.empty": `"mail" no puede estar vacio`,
  }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$"))
    .required()
    .messages({
      "string.base": "La contraseña debe ser texto",
      "string.pattern.base":
      "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un número",
      "any.required": "Password es un campo obligatorio",
      "string.empty": "Password no puede estar vacio",
    }),
  colabname:Joi.string().min(4).max(30).required().messages({
    "string.base": "Colabname debe ser texto",
    'string.min': `"Colabname" debe tener al menos {#limit} caracteres`,
    'string.max': `"Colabname" no puede tener más de {#limit} caracteres`,
    "any.required": "Colabname es un campo obligatorio",
    "string.empty": "Colabname no puede estar vacio",
  }),
  role: Joi.string().uuid({ version: "uuidv4" }).required().messages({
    "string.guid": `El rol debe ser un uuidV4 valido`,
    "any.required": "El rol es un campo obligatorio",
  }),
  recoveryMail: Joi.string().email().optional().messages({
    "string.base": `"recoveryMail" debe ser una cadena de texto`,
    "string.email": `"recoveryMail" debe ser un correo electrónico válido`,
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "El número de teléfono debe contener exactamente 10 dígitos numéricos",
    }),
  prefix: Joi.string()
    .pattern(/^\+[0-9]{1,3}$/)
    .optional()
    .messages({
      "string.pattern.base":
        'El prefijo de teléfono debe comenzar con "+" seguido de entre 1 y 3 dígitos numéricos',
    }),
});
const tokenSchema = Joi.string().custom((value: string, helpers) => {
  if (typeof value != typeof String()) {
    return helpers.message({
      custom: "El token debe ser de tipo String",
    });
  }
  const parts = value.split(".");
  if (parts.length != 3) {
    return helpers.message({
      custom: "El token debe tener un formato de partes valido",
    });
  }
  const base64UrlPattern = /^[A-Za-z0-9-_]+$/;
  for (const part of parts) {
    if (!base64UrlPattern.test(part)) {
      return helpers.message({
        custom: "Cada parte del token debe estar en formato Base64URL",
      });
    }
  }
});
const tokenAuthSchema = Joi.object({
  authorization: tokenSchema.required().messages({
    "any.required": `token de autenticacion es un valor obligatorio`,
    "string.empty": `token de autenticacion no puede estar vacio`,
  }),
}).unknown(true);
const tokenGetterSchema = Joi.object({
  token: tokenSchema.required().messages({
    "any.required": `token de autenticacion es un valor obligatorio`,
    "string.empty": `token de autenticacion no puede estar vacio`,
  }),
});
const signInSchema = Joi.object({
  mail: Joi.string().email().required().messages({
    "string.base": `"mail" debe ser una cadena de texto`,
    "string.email": `"mail" debe ser un correo electrónico válido`,
    "any.required": `"mail" es un campo obligatorio`,
    "string.empty": `"mail" no puede estar vacio`,
  }),
  password: Joi.string()
    .required()
    .messages({
      "string.base": "La contraseña debe ser texto",
      "any.required": "Password es un campo obligatorio",
      "string.empty": "Password no puede estar vacio",
    }),
});
const getRecoveryMailSchema = Joi.object({
  mail: Joi.string().email().required().messages({
    "string.base": `"mail" debe ser una cadena de texto`,
    "string.email": `"mail" debe ser un correo electrónico válido`,
    "any.required": `"mail" es un campo obligatorio`,
    "string.empty": `"mail" no puede estar vacio`,
  }),
});
const changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .messages({
      "string.base": "La contraseña debe ser texto",
      "any.required": "Password es un campo obligatorio",
      "string.empty": "Password no puede estar vacio",
    }),
  oldPassword: Joi.string()
    .required()
    .messages({
      "string.base": "La contraseña debe ser texto",
      "any.required": "Password es un campo obligatorio",
      "string.empty": "Password no puede estar vacio",
    }),
});
const changeMailSchema = Joi.object({
  mail: Joi.string().email().required().messages({
    "string.base": `"mail" debe ser una cadena de texto`,
    "string.email": `"mail" debe ser un correo electrónico válido`,
    "any.required": `"mail" es un campo obligatorio`,
    "string.empty": `"mail" no puede estar vacio`,
  }),
});
export {
  signUpSchema,
  tokenAuthSchema,
  tokenGetterSchema,
  signInSchema,
  getRecoveryMailSchema,
  changeMailSchema,
  changePasswordSchema,
};
