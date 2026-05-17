"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import Reveal from "./Reveal";

type GalleryImage = {
  name: string;
  src: string;
};

const initialVisibleCount = 9;
const visibleStep = 6;

export default function GallerySection({ images }: { images: GalleryImage[] }) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const visibleImages = images.slice(0, visibleCount);
  const hasMoreImages = visibleImages.length < images.length;

  return (
    <section className="section-shell" id="galeri">
      <Reveal className="section-heading">
        <p className="section-kicker">Galeri</p>
        <h2 className="section-title">Atölyeden kareler</h2>
      </Reveal>

      {images.length > 0 ? (
        <>
          <div className="gallery-columns">
            {visibleImages.map((image, index) => (
              <motion.button
                aria-label="Galeri fotoğrafını büyüt"
                className="gallery-item group"
                initial={{ opacity: 0, y: 34 }}
                key={image.name}
                onClick={() => setActiveImage(image)}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (index % 6) * 0.05 }}
                viewport={{ once: true, amount: 0.12 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <img alt="Gezici Sanat Atölyesi seramik çarkı galeri fotoğrafı" src={image.src} />
              </motion.button>
            ))}
          </div>
          {hasMoreImages ? (
            <div className="gallery-more">
              <button
                onClick={() => setVisibleCount((count) => Math.min(count + visibleStep, images.length))}
                type="button"
              >
                + Daha Fazla Göster
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <Reveal className="empty-gallery">
          Galeri klasöründe jpg, jpeg, png veya webp görsel bulunamadı.
        </Reveal>
      )}

      <AnimatePresence>
        {activeImage ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="lightbox"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="lightbox-inner"
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              onClick={(event) => event.stopPropagation()}
              transition={{ duration: 0.25 }}
            >
              <button
                aria-label="Galeriyi kapat"
                className="lightbox-close"
                onClick={() => setActiveImage(null)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
              <img alt="Büyütülmüş seramik atölyesi galeri fotoğrafı" src={activeImage.src} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
