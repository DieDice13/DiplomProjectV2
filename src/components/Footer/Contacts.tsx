function Contacts() {
  return (
    <div className="flex flex-col">
      <a
        href="/"
        className="text-[56px] font-bold no-underline text-[var(--site-selector)] hover:text-[var(--site-selector-hover)] transition-colors"
      >
        TECHDICE
      </a>

      <div className="mt-5">
        <div className="mb-4">
          <a href="tel:+77007077777" className="text-black font-bold no-underline text-xl">
            +7(700) 707-77-77
          </a>
          <p className="text-sm text-gray-600">Справочная служба</p>
        </div>
        <div className="mb-4">
          <a href="tel:+77007077777" className="text-black font-bold no-underline text-xl">
            +7(700) 707-77-77
          </a>
          <p className="text-sm text-gray-600">Интернет-магазин</p>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
