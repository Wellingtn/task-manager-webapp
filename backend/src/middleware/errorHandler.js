function errorHandler(error, req, res, next) {
  console.error(error);

  if (error && error.code === "ER_BAD_DB_ERROR") {
    return res.status(500).json({
      message: "Banco de dados não encontrado. Verifique se você criou o banco task_manager."
    });
  }

  if (error && error.code === "ECONNREFUSED") {
    return res.status(500).json({
      message: "Não foi possível conectar ao MySQL. Verifique se o serviço está ativo."
    });
  }

  return res.status(500).json({
    message: "Erro interno do servidor."
  });
}

module.exports = errorHandler;
