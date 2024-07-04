import type { FlagType } from 'package/src/utils/OperationFactory'
import OperationFactory from 'package/src/utils/OperationFactory'
import type { ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb'

type CommandInput = ScanCommandInput
type CommandOutput = ScanCommandOutput

export default class ScanOperation<
  TS extends TableSchema,
  FT extends FlagType,
  CIT extends CommandInput,
  OT extends string,
> extends OperationFactory<TS, FT, CIT> {
  #CLONE_INSTANCE<
    OmitMethodName extends string,
    PartialCommand extends Partial<CommandInput>,
  >(newCommand: PartialCommand) {
    const { ddb, schema, flags, command: _command } = this
    const command = { ..._command, ...newCommand } as const
    const props = { ddb, schema, flags, command }
    type CT = typeof command
    type FT = typeof this.flags
    type _OT = OT | OmitMethodName
    return new ScanOperation(props) as Omit<ScanOperation<TS, FT, CT, _OT>, _OT>
  }

  // Segment
  // TotalSegments

  // TableName
  // IndexName

  // ConsistentRead
  // Limit
  // Select
  // ExclusiveStartKey

  // FilterExpression
  // ProjectionExpression

  // ExpressionAttributeNames
  // ExpressionAttributeValues

  // ReturnConsumedCapacity: "NONE" "TOTAL" "INDEXES"
}

// Count and ScannedCount only return the count of items specific to a single scan request and, unless the table is less than 1MB, do not represent the total number of items in the table.
// DynamoDB does not provide snapshot isolation for a scan operation when the ConsistentRead parameter is set to true. Thus, a DynamoDB scan operation does not guarantee that all reads in a scan see a consistent snapshot of the table when the scan operation was requested.
