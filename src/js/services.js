import { servicesData } from "../constants/services.js";
import { observeRevealItems } from "../utils/observeRevealItems.js";

const servicesCardsWrapper = document.getElementById("clinicServices");

export const servicesJs = () => {
  if (!servicesData) return;

  servicesCardsWrapper.innerHTML = servicesData
    .map(
      (service, index) => `
          <div
            class="reveal group rounded-2xl bg-white last:bg-[#0d2430] last:text-white p-8 shadow-sm ring-1 ring-[#0d2430]/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0d2430]/10"
          >
            <span class="text-3xl ${service.numberColor}"> ${(index + 1).toString().padStart(2, "0")}</span>
            <h3
              class="mt-5 font-serif text-xl"
              data-i18n="${service.titleKey}"
            >
              ${service.title}
            </h3>
            <p
              class="mt-3 text-sm leading-6 text-[#65757b]"
              data-i18n="${service.textKey}"
            >
             ${service.text}
            </p>
          </div>`,
    )
    .join("");

  observeRevealItems(servicesCardsWrapper.querySelectorAll(".reveal"));
};
