"use client";
import { CarrelloProvider } from "@/context/CarrelloContext";

const Providers = ({ children }) => {
    return <CarrelloProvider>{children}</CarrelloProvider>;
};
export default Providers;
