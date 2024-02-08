import { Holder } from './Holder'
import { Issuer, credentialsSupported } from './Issuer'
import { Verifier, presentationDefinitions } from './Verifier'

describe('Testing the happy path', () => {
  it('should run the happy path', async () => {
    const credential = credentialsSupported[0]
    const issuer = await Issuer.build()
    const holder = await Holder.build()
    const verifier = await Verifier.build()

    // Issue, resolve and store credential
    const credentialOffer = await issuer.createCredentialOffer([credential.id])
    const resolvedCredentialOffer = await holder.resolveCredentialOffer(credentialOffer)
    const accepted = await holder.requestAndStoreCredentials(
      resolvedCredentialOffer,
      resolvedCredentialOffer.offeredCredentials.map((credential) => credential.id)
    )

    // Request presentation/ present and verify
    const proofRequest = await verifier.createProofRequest(presentationDefinitions[0])
    const resolvedProofRequest = await holder.resolveProofRequest(proofRequest)
    const resolvedPresentationRequest = await holder.acceptPresentationRequest(resolvedProofRequest)

    expect(resolvedPresentationRequest).toMatchSnapshot()
    expect(resolvedPresentationRequest.status).toBe(200)
  })
})
