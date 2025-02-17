import { BalancerApi } from "@balancer/sdk"

const URL = 'https://api-v3.balancer.fi'

export function buildBalancerClient(chainId: number): BalancerApi  {
  return new BalancerApi(URL, chainId)
}

export async function queryAPI(query: any) {
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "query": query })
  }).then((response) => response.json())
  
}
