import { Holder } from './Holder'
import { Issuer, credentialsSupported } from './Issuer'
import { Verifier, presentationDefinitions } from './Verifier'

describe('Testing the happy path', () => {
  let issuer: Issuer
  let holder: Holder
  let verifier: Verifier

  beforeAll(async () => {
    ;[issuer, holder, verifier] = await Promise.all([Issuer.build(), Holder.build(), Verifier.build()])
  })
  test.each(credentialsSupported)('should run the happy path for credential $id', async (credential) => {
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

  afterAll(async () => {
    await Promise.all([issuer.restart(), holder.restart(), verifier.restart()])
  })
})
