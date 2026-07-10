import { PREDEFINED_PRODUCTS, PredefinedProduct } from "../types";
import { 
  Accessibility, 
  Trees, 
  Megaphone, 
  DollarSign, 
  Archive, 
  FileSpreadsheet, 
  Home, 
  CalendarDays, 
  BookOpen, 
  Check,
  PackageCheck
} from "lucide-react";
import { motion } from "motion/react";

interface ProductSelectorProps {
  selectedProducts: string[];
  toggleProduct: (productName: string) => void;
}

// Map string icon names to Lucide icon components
const IconMap: Record<string, React.ComponentType<any>> = {
  Accessibility,
  Trees,
  Megaphone,
  DollarSign,
  Archive,
  FileSpreadsheet,
  Home,
  CalendarDays,
  BookOpen,
};

export default function ProductSelector({ selectedProducts, toggleProduct }: ProductSelectorProps) {
  return (
    <div className="space-y-4" id="product-selector-container">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-indigo-600" />
            <span>Select Implementation Products</span>
          </h3>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          {selectedProducts.length} selected
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="product-grid">
        {PREDEFINED_PRODUCTS.map((product) => {
          const isSelected = selectedProducts.includes(product.name);
          const IconComponent = IconMap[product.iconName] || BookOpen;

          return (
            <motion.div
              key={product.name}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleProduct(product.name)}
              className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all shadow-xs ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
              id={`product-card-${product.name.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div>
                {/* Category & Checkbox */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    isSelected 
                      ? "bg-indigo-100 text-indigo-800" 
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {product.category}
                  </span>
                  
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                    isSelected 
                      ? "border-indigo-600 bg-indigo-600 text-white" 
                      : "border-slate-300 bg-white"
                  }`}>
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Title & Icon */}
                <div className="flex items-start gap-2.5 mt-1.5">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {product.name}
                    </h4>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
