export const until = async (predicate, { timeout = 1000, interval = 50 } = {}) => {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      if (await predicate()) return
    } catch {
      // ignore
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }
  throw new Error('Timeout')
}
