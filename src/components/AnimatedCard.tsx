import { motion } from 'framer-motion'

interface AnimatedCardProps {
    title: string
    description: string
    variant?: 'default' | 'primary' | 'accent' | 'warning'
}

export function AnimatedCard({ title, description, variant = 'default' }: AnimatedCardProps) {
    const variantStyles = {
        default: {},
        primary: { background: 'var(--brand-primary)', color: 'var(--brand-primary-foreground)' },
        accent: { background: 'var(--brand-accent)', color: 'var(--brand-accent-foreground)' },
        warning: { background: 'var(--brand-warning)', color: 'var(--brand-warning-foreground)' },
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            style={variant !== 'default' ? variantStyles[variant] : {}}
            className={`rounded-lg border p-6 shadow-sm cursor-pointer bg-card text-card-foreground border-border will-change-transform`}
        >
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm opacity-80">{description}</p>
        </motion.div>
    )
}
