/**
 * @private
 * @function OperationErrorHandler - A function that handles errors from operations
 */
export default function OperationErrorHandler(error: unknown) {
  // InternalServerError

  console.error('ERROR Put Operation: ', error)
  throw error
}
