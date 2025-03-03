# Challenge Project

Congratulations on making it to the challenge project!

A core interaction with the Balancer protocol is the ability to swap between tokens using the liquidity on Balancer. For this challenge, you will build an interface that allows the user to swap from WETH to USDC on Arbitrum. You will need to figure out how to construct a swap using the Balancer API and SDK, you should be able to figure this out by following the documentation. The interface should provide a single input for the input token amount (WETH) and display the quoted return amount whenever the amount in that input is changed. The user should then be able to execute that swap transaction with their wallet.

You should use RainbowKit and WAGMI to set up the wallet connection and allow the user to execute the transaction.

You can use any React framework to build the app, e.g. NextJS or a vanilla React app.

You will need:
- Some ETH on Arbitrum (we will send you some)
- Swap some of that ETH to WETH for testing your swap interface.
- You might need to swap USDC back to WETH using the Balancer UI so you can keep testing your app.

Arbitrum chainID: 42161
WETH address: 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1
USDC address: 0xaf88d065e77c8cC2239327C5EDb3A432268e5831

## Bonus

Allow the user to switch the swap direction so you can also swap from USDC to WETH. 

## Notes

There are some issues with the documentation that need to be fixed, this Github issue explains what those issues are. You should be able to use the documentation along with the information in [this issue](https://github.com/balancer/docs-v3/issues/225) to figure everything out.

If you need help with anything, please reach out to alberto@balancer.finance

---

# Starting steps

```
#> npm install
#> npm run dev
```

# Possible improvements

As a coding test, not everything that should be in a final version has been added. The most obvious improvement should be the addition of tests. End-to-end tests could be added (e.g. using an anvil instance) to test the "happy paths" so the integration with external systems is tested. Some unit / component tests could also be used to check form UI behaviour when non normal states happen (errors returned by external systems, failed user inputs, etc.).

The UI can also be refined so the user gets more information about whats going on. Examples of this could be adding extra information about the swap like the expected gas involved in the transaction or adding loading widgets when getting information through hooks (like balance for a given token or the expected price impact).
