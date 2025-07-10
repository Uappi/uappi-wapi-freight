const fetch = require('node-fetch');

/**
 * Middleware serverless para DigitalOcean Functions
 * Integra a WAPI da Uappi com a API de cálculo de frete do cliente
 */
async function main(args) {
  try {
    // Extrair dados relevantes do payload da Uappi (ajustar conforme necessário)
    const uappiPayload = args;

    // Montar payload para a API do cliente (ajustar conforme o que a API espera)
    const clientePayload = {
      // Exemplo: ajustar campos conforme esperado
      origem: uappiPayload.origin?.postalCode,
      destino: uappiPayload.destination?.postalCode,
      peso: uappiPayload.items?.[0]?.weight,
      valor: uappiPayload.items?.[0]?.price,
      // ... outros campos necessários
    };

    // Fazer chamada à API do cliente
    const response = await fetch('https://api.cliente.com/frete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adicione headers extras se necessário (ex: Authorization)
      },
      body: JSON.stringify(clientePayload),
    });

    const data = await response.json();

    // Adaptar a resposta da API do cliente para o formato esperado pela Uappi
    const resultado = {
      content: [
        {
          Items: [
            {
              Status: data.Status || 'error',
              Message: data.Message || '',
              Error: data.Error || 'Erro desconhecido ao calcular o frete.'
            }
          ]
        }
      ]
    };

    return { body: JSON.stringify(resultado) };
  } catch (error) {
    // Em caso de erro na integração
    return {
      body: JSON.stringify({
        content: [
          {
            Items: [
              {
                Status: 'error',
                Message: 'Erro na integração com a API de frete do cliente.',
                Error: error.message
              }
            ]
          }
        ]
      })
    };
  }
}

exports.main = main;
