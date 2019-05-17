
interface LogEventCallback {
  (name: string, ...args: any[]): void,
}

interface LogListener {
  fn: LogEventCallback,
  matchNames?: RegExp[]
}

interface LogFunction {
  (...args: any[]): void,
}

interface LogUnsubscriber {
  (): void
}

interface Logger {
  (name: string, localLog?: LogFunction): LogFunction,
  listen(nameOrFn: (string | LogEventCallback), fn?: LogEventCallback): LogUnsubscriber,
  silence(name: string): void,
  clear(): void,
}

const logListeners: LogListener[] = []
const silencedLoggers: RegExp[] = []

const matchesOne = (str: string, matchNames: RegExp[]): boolean => {
  for (const r of matchNames) {
    if (r.test(str)) return true
  }
  return false
}

/**
 * Create a log function that logs under a given name
 *
 * @param name Unique name, such as a prefixed/namespaced module name
 * @param localLog= Listen to individual log function
 */
const logger: Logger = (name: string, localLog?: LogFunction): LogFunction => {

  const log: LogFunction = (...args: any[]): void => {

    if (matchesOne(name, silencedLoggers)) return

    for (const { fn, matchNames } of logListeners) {
      if (!matchNames || matchesOne(name, matchNames)) fn(name, ...args)
    }

    if (localLog) localLog(...args)
  }

  return log
}

const regExpFromName = (name: string): RegExp => new RegExp(`^${name.replace(/\*/g, '.*?')}$`)
const regExpsFromName = (name: string): RegExp[] => name.split(',').map(regExpFromName)

/**
 * Listen to all log events
 */
logger.listen = (nameOrFn: (string | LogEventCallback), fn?: LogEventCallback): LogUnsubscriber => {

  const listener: LogListener = !fn
    ? { fn: nameOrFn as LogEventCallback }
    : { fn, matchNames: regExpsFromName(nameOrFn as string) }

  logListeners.push(listener)

  const unsubscribe: LogUnsubscriber = () => {
    const pos = logListeners.indexOf(listener)
    if (pos<0) return
    logListeners.splice(pos, 1)
  }

  return unsubscribe
}

logger.silence = (name: string): void => {
  silencedLoggers.push(...regExpsFromName(name))
}

logger.clear = (): void => {
  logListeners.splice(0)
  silencedLoggers.splice(0)
}

export default logger
