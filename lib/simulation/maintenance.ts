import { MaintenanceConfig } from './types'

export function getTotalDiscount(cfg: MaintenanceConfig) {
  return Math.min(
    cfg.tokenDiscount + cfg.streakDiscount + cfg.vipDiscount,
    0.2987,
  )
}
