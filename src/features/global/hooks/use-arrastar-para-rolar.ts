import { useRef, useEffect } from "react";

export function useArrastarParaRolar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let arrastando = false;
    let startX = 0;
    let scrollLeft = 0;

    const iniciar = (e: MouseEvent) => {
      arrastando = true;
      el.classList.add("cursor-grabbing");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const encerrar = () => {
      arrastando = false;
      el.classList.remove("cursor-grabbing");
    };

    const mover = (e: MouseEvent) => {
      if (!arrastando) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX) * 1.5;
    };

    el.addEventListener("mousedown", iniciar);
    el.addEventListener("mouseleave", encerrar);
    el.addEventListener("mouseup", encerrar);
    el.addEventListener("mousemove", mover);

    return () => {
      el.removeEventListener("mousedown", iniciar);
      el.removeEventListener("mouseleave", encerrar);
      el.removeEventListener("mouseup", encerrar);
      el.removeEventListener("mousemove", mover);
    };
  }, []);

  return ref;
}
