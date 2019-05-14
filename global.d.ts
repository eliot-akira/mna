
declare var test: {
  /**
   * Tester
   *
   * @param {string} title - Title of test
   * @param {function} fn - Test function closure
   */
  (
    title: string,
    fn: (
      it: (
        title: string,
        pass: any,
        ...logOnFail: any[]
      ) => void,
      assert: {
        [key: string]: (...args: any[]) => boolean
      }
    ) => void
  ): void,
  setup(fn: () => Promise<void> | void): void
}
