import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions d'utilisation - Amicale FPHM",
  description: "Conditions générales d'utilisation du site de l'Amicale FPHM.",
};

export default function ConditionsUtilisationPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pt-16 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">— AMICALE FPHM</p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(36px,8vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            Conditions <span className="italic text-[var(--accent)]">d&apos;utilisation</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-2)]">
            Les règles applicables à l&apos;accès et à l&apos;usage du site de l&apos;Amicale FPHM.
          </p>
          <div className="mt-8 border-b border-[var(--line)]" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="max-w-3xl space-y-8 text-[15px] leading-relaxed text-[var(--ink-2)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Objet</h2>
            <p className="mt-3">
              Les présentes conditions ont pour objet de définir les modalités d&apos;accès et d&apos;utilisation du
              site internet de l&apos;Amicale FPHM.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Accès au service</h2>
            <p className="mt-3">
              Le site est accessible gratuitement à tout utilisateur disposant d&apos;un accès internet. Certaines
              rubriques peuvent être réservées aux membres ou nécessiter une authentification.
            </p>
            <p className="mt-2">
              L&apos;association s&apos;efforce d&apos;assurer une disponibilité raisonnable du service sans garantir
              une accessibilité permanente et continue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Responsabilité</h2>
            <p className="mt-3">
              Les informations publiées sur le site sont fournies à titre informatif. Malgré le soin apporté à leur
              mise à jour, des erreurs ou omissions peuvent subsister.
            </p>
            <p className="mt-2">
              L&apos;Amicale FPHM ne peut être tenue responsable des dommages directs ou indirects liés à
              l&apos;utilisation du site, dans les limites autorisées par la réglementation applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Comportement de l&apos;utilisateur</h2>
            <p className="mt-3">
              L&apos;utilisateur s&apos;engage à utiliser le site de manière loyale et conforme aux lois en vigueur.
              Sont notamment interdits : tout usage frauduleux, toute tentative d&apos;intrusion, ou tout acte portant
              atteinte au bon fonctionnement du service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Modification des conditions</h2>
            <p className="mt-3">
              L&apos;association peut modifier les présentes conditions à tout moment afin de tenir compte de
              l&apos;évolution du site, des services proposés ou du cadre légal. La version en ligne fait foi à sa date
              de publication.
            </p>
          </section>

          <p className="text-sm text-[var(--ink-2)]/80 border-t border-[var(--line)] pt-5">
            Ce document est fourni à titre général et peut nécessiter une adaptation ou une validation juridique selon
            votre situation.
          </p>
        </div>
      </div>
    </div>
  );
}
