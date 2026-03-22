import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface DonateOverlayContextType {
  isOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
}

const DonateOverlayContext = createContext<DonateOverlayContextType>({
  isOpen: false,
  openOverlay: () => {},
  closeOverlay: () => {},
});

export const useDonateOverlay = () => useContext(DonateOverlayContext);

export const DonateOverlayProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openOverlay = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeOverlay = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  return (
    <DonateOverlayContext.Provider value={{ isOpen, openOverlay, closeOverlay }}>
      {children}
    </DonateOverlayContext.Provider>
  );
};
