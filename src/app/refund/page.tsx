import { LegalLayout } from '@/components/layout/LegalLayout';

export default function RefundPolicy() {
    return (
        <LegalLayout title="Refund Policy" lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}>
            <section>
                <div className="bg-cyan-950/20 border border-cyan-500/30 p-6 rounded-lg mb-8">
                    <p className="text-cyan-200 uppercase tracking-widest text-sm font-bold mb-2">Important Notice</p>
                    <p className="m-0 text-slate-300">
                        This policy is strictly enforced to protect the integrity of the LUNATHELOVEGOD ecosystem and reduce fraudulent chargebacks.
                    </p>
                </div>

                <h2>1. Digital Products</h2>
                <p>
                    All digital products (including audio downloads, digital art, exclusive stem packs, or unique AI generations) are <strong>non-refundable</strong> unless otherwise stated by applicable law.
                </p>
                <p>
                    Due to the instant and irrevocable nature of digital goods, once a product is accessed, viewed, or downloaded, refunds cannot and will not be issued.
                </p>
            </section>

            <section>
                <h2>2. Subscriptions & Memberships</h2>
                <p>
                    Subscriptions to the Space Invaders network, Ice Giants tiers, or other exclusive clubs may be canceled at any time.
                </p>
                <ul>
                    <li>Cancellation stops future billing cycles automatically.</li>
                    <li>We do <strong>not</strong> offer prorated refunds for partial billing cycles unless required by local law. You will retain access until the end of your current paid period.</li>
                </ul>
            </section>

            <section>
                <h2>3. AI Usage Credits</h2>
                <p>
                    If applicable to certain platform features (such as extended usage of the Comms Interface), AI usage credits once consumed are permanently non-refundable. Unused credits may expire according to the terms of your specific subscription plan.
                </p>
            </section>

            <section>
                <h2>4. Exceptional Circumstances</h2>
                <p>
                    Refunds may be issued at our sole discretion exclusively in cases involving:
                </p>
                <ul>
                    <li>Verifiable billing errors on our end.</li>
                    <li>Duplicate charges for the same transaction.</li>
                    <li>Severe technical failure preventing service access for an extended duration.</li>
                </ul>
                <p>
                    Requests for exceptional circumstances must be submitted to <a href="mailto:support@lunathelovegod.com">support@lunathelovegod.com</a> within <strong>14 days</strong> of the initial charge.
                </p>
            </section>

            <section className="bg-red-950/20 border border-red-500/30 p-6 rounded-lg my-8">
                <h2 className="!mt-0 text-red-400">5. Chargebacks & Disputes</h2>
                <p>
                    Initiating a forced chargeback with your bank or credit card provider without contacting our support team first is considered a violation of our Terms of Service and may result in:
                </p>
                <ul className="text-slate-300">
                    <li className="marker:text-red-500">Immediate and irrevocable account suspension.</li>
                    <li className="marker:text-red-500">A permanent ban from the LUNATHELOVEGOD platform and all related events.</li>
                    <li className="marker:text-red-500">Potential legal recovery of funds and associated dispute fees.</li>
                </ul>
                <p className="font-bold text-red-200">
                    We heavily encourage all users to contact support first to resolve any billing issues amicably.
                </p>
            </section>
        </LegalLayout>
    );
}
