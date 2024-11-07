const ASAAS_API_KEY = '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAzOTkzOTk6OiRhYWNoXzQwOGM0YmFiLTAzOGUtNGY2My1iZmU1LWNlMGRjYzk2Yjk5YQ==';
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';

export async function createCustomer(data: {
  name: string;
  email: string;
  cpfCnpj: string;
}) {
  const response = await fetch(`${ASAAS_API_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Erro ao criar cliente no Asaas');
  }

  return response.json();
}

export async function createSubscription(data: {
  customer: string;
  billingType: string;
  value: number;
  nextDueDate: string;
  cycle: string;
}) {
  const response = await fetch(`${ASAAS_API_URL}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Erro ao criar assinatura no Asaas');
  }

  return response.json();
}