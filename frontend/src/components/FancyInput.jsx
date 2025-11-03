import { motion } from 'framer-motion';

// Shared FancyInput component extracted from Signup to unify design language.
// Props: icon (Lucide icon component), label, children (for adornments), and standard input props.
const FancyInput = ({ icon: Icon, label, children, ...props }) => {
  return (
    <div className="group relative z-0">
      <label htmlFor={props.name} className="text-xs font-medium text-gray-600 mb-1 block tracking-wide">{label}</label>
      <div className="relative z-10">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-black transition" size={18} />}
        <input
          id={props.name}
          className="w-full rounded-xl bg-white/80 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none pl-10 pr-10 py-3 text-sm placeholder-gray-400 shadow-sm transition backdrop-blur-sm"
          {...props}
          required={props.required !== false && props.type !== 'date'}
        />
        {children}
      </div>
      {/* Glow behind input */}
      <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition bg-gradient-to-r from-purple-200/70 to-pink-200/70 blur-md z-[-1]" />
    </div>
  );
};

export default FancyInput;
