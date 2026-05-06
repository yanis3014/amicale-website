import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales - Amicale FPHM',
  description: "Informations légales relatives au site de l'Amicale FPHM.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pt-16 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">— AMICALE FPHM</p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(36px,8vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            Mentions <span className="italic text-[var(--accent)]">légales</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-2)]">
            Les informations essentielles concernant l&apos;éditeur, l&apos;hébergement et l&apos;utilisation du contenu
            de ce site.
          </p>
          <div className="mt-8 border-b border-[var(--line)]" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="max-w-3xl space-y-8 text-[15px] leading-relaxed text-[var(--ink-2)]">
          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Éditeur du site</h2>
            <p className="mt-3">
              Le présent site est édité par l&apos;Amicale des Enseignants de la Faculté de Pharmacie de Monastir
              (Amicale FPHM), association à but non lucratif.
            </p>
            <p className="mt-2">Adresse de contact : Décanat FPHM, Avenue Avicenne, 5000 Monastir.</p>
            <p className="mt-2">
              Contact :{' '}
              <a className="text-[var(--accent)] underline underline-offset-4" href="mailto:asso.fphm@gmail.com">
                asso.fphm@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Directeur de la publication</h2>
            <p className="mt-3">
              Le directeur de la publication est le représentant légal de l&apos;association ou toute personne
              dûment mandatée par celle-ci.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Hébergement</h2>
            <p className="mt-3">
              Le site est hébergé par un prestataire technique professionnel. Les informations d&apos;hébergement
              détaillées peuvent être communiquées sur demande via le contact ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Propriété intellectuelle</h2>
            <p className="mt-3">
              L&apos;ensemble des contenus du site (textes, visuels, logos, documents, structure) est protégé par les
              règles applicables en matière de propriété intellectuelle.
            </p>
            <p className="mt-2">
              Toute reproduction, diffusion, modification ou exploitation non autorisée, totale ou partielle, est
              interdite sauf accord préalable écrit de l&apos;association ou des ayants droit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">Contact</h2>
            <p className="mt-3">
              Pour toute question relative au site, vous pouvez écrire à{' '}
              <a className="text-[var(--accent)] underline underline-offset-4" href="mailto:asso.fphm@gmail.com">
                asso.fphm@gmail.com
              </a>
              .
            </p>
          </section>

          <p className="text-sm text-[var(--ink-2)]/80 border-t border-[var(--line)] pt-5">
            Ces mentions légales constituent une base informative et peuvent être adaptées après validation juridique
            selon l&apos;évolution des obligations réglementaires de l&apos;association.
          </p>
        </div>
      </div>
    </div>
  );
}
