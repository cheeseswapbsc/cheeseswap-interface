// Eagerly bundle all wallet icons so they can be looked up by file name
// (Vite replacement for webpack's dynamic require()).
const icons = import.meta.glob('../assets/images/*', { eager: true, import: 'default' }) as Record<string, string>

export function walletIcon(iconName: string): string {
  return icons[`../assets/images/${iconName}`]
}
