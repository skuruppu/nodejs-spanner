// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Note: this file is purely for documentation. Any contents are not expected
// to be loaded as the JS file.

/**
 * Results from Read or
 * ExecuteSql.
 *
 * @property {Object} metadata
 *   Metadata about the result set, such as row type information.
 *
 *   This object should have the same structure as [ResultSetMetadata]{@link google.spanner.v1.ResultSetMetadata}
 *
 * @property {Object[]} rows
 *   Each element in `rows` is a row whose format is defined by
 *   metadata.row_type. The ith element
 *   in each row matches the ith field in
 *   metadata.row_type. Elements are
 *   encoded based on type as described
 *   here.
 *
 *   This object should have the same structure as [ListValue]{@link google.protobuf.ListValue}
 *
 * @property {Object} stats
 *   Query plan and execution statistics for the SQL statement that
 *   produced this result set. These can be requested by setting
 *   ExecuteSqlRequest.query_mode.
 *   DML statements always produce stats containing the number of rows
 *   modified, unless executed using the
 *   ExecuteSqlRequest.QueryMode.PLAN ExecuteSqlRequest.query_mode.
 *   Other fields may or may not be populated, based on the
 *   ExecuteSqlRequest.query_mode.
 *
 *   This object should have the same structure as [ResultSetStats]{@link google.spanner.v1.ResultSetStats}
 *
 * @typedef ResultSet
 * @memberof google.spanner.v1
 * @see [google.spanner.v1.ResultSet definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/spanner/v1/result_set.proto}
 */
const ResultSet = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Partial results from a streaming read or SQL query. Streaming reads and
 * SQL queries better tolerate large result sets, large rows, and large
 * values, but are a little trickier to consume.
 *
 * @property {Object} metadata
 *   Metadata about the result set, such as row type information.
 *   Only present in the first response.
 *
 *   This object should have the same structure as [ResultSetMetadata]{@link google.spanner.v1.ResultSetMetadata}
 *
 * @property {Object[]} values
 *   A streamed result set consists of a stream of values, which might
 *   be split into many `PartialResultSet` messages to accommodate
 *   large rows and/or large values. Every N complete values defines a
 *   row, where N is equal to the number of entries in
 *   metadata.row_type.fields.
 *
 *   Most values are encoded based on type as described
 *   here.
 *
 *   It is possible that the last value in values is "chunked",
 *   meaning that the rest of the value is sent in subsequent
 *   `PartialResultSet`(s). This is denoted by the chunked_value
 *   field. Two or more chunked values can be merged to form a
 *   complete value as follows:
 *
 *     * `bool/number/null`: cannot be chunked
 *     * `string`: concatenate the strings
 *     * `list`: concatenate the lists. If the last element in a list is a
 *       `string`, `list`, or `object`, merge it with the first element in
 *       the next list by applying these rules recursively.
 *     * `object`: concatenate the (field name, field value) pairs. If a
 *       field name is duplicated, then apply these rules recursively
 *       to merge the field values.
 *
 *   Some examples of merging:
 *
 *       # Strings are concatenated.
 *       "foo", "bar" => "foobar"
 *
 *       # Lists of non-strings are concatenated.
 *       [2, 3], [4] => [2, 3, 4]
 *
 *       # Lists are concatenated, but the last and first elements are merged
 *       # because they are strings.
 *       ["a", "b"], ["c", "d"] => ["a", "bc", "d"]
 *
 *       # Lists are concatenated, but the last and first elements are merged
 *       # because they are lists. Recursively, the last and first elements
 *       # of the inner lists are merged because they are strings.
 *       ["a", ["b", "c"]], [["d"], "e"] => ["a", ["b", "cd"], "e"]
 *
 *       # Non-overlapping object fields are combined.
 *       {"a": "1"}, {"b": "2"} => {"a": "1", "b": 2"}
 *
 *       # Overlapping object fields are merged.
 *       {"a": "1"}, {"a": "2"} => {"a": "12"}
 *
 *       # Examples of merging objects containing lists of strings.
 *       {"a": ["1"]}, {"a": ["2"]} => {"a": ["12"]}
 *
 *   For a more complete example, suppose a streaming SQL query is
 *   yielding a result set whose rows contain a single string
 *   field. The following `PartialResultSet`s might be yielded:
 *
 *       {
 *         "metadata": { ... }
 *         "values": ["Hello", "W"]
 *         "chunked_value": true
 *         "resume_token": "Af65..."
 *       }
 *       {
 *         "values": ["orl"]
 *         "chunked_value": true
 *         "resume_token": "Bqp2..."
 *       }
 *       {
 *         "values": ["d"]
 *         "resume_token": "Zx1B..."
 *       }
 *
 *   This sequence of `PartialResultSet`s encodes two rows, one
 *   containing the field value `"Hello"`, and a second containing the
 *   field value `"World" = "W" + "orl" + "d"`.
 *
 *   This object should have the same structure as [Value]{@link google.protobuf.Value}
 *
 * @property {boolean} chunkedValue
 *   If true, then the final value in values is chunked, and must
 *   be combined with more values from subsequent `PartialResultSet`s
 *   to obtain a complete field value.
 *
 * @property {Buffer} resumeToken
 *   Streaming calls might be interrupted for a variety of reasons, such
 *   as TCP connection loss. If this occurs, the stream of results can
 *   be resumed by re-sending the original request and including
 *   `resume_token`. Note that executing any other transaction in the
 *   same session invalidates the token.
 *
 * @property {Object} stats
 *   Query plan and execution statistics for the statement that produced this
 *   streaming result set. These can be requested by setting
 *   ExecuteSqlRequest.query_mode and are sent
 *   only once with the last response in the stream.
 *   This field will also be present in the last response for DML
 *   statements.
 *
 *   This object should have the same structure as [ResultSetStats]{@link google.spanner.v1.ResultSetStats}
 *
 * @typedef PartialResultSet
 * @memberof google.spanner.v1
 * @see [google.spanner.v1.PartialResultSet definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/spanner/v1/result_set.proto}
 */
const PartialResultSet = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Metadata about a ResultSet or PartialResultSet.
 *
 * @property {Object} rowType
 *   Indicates the field names and types for the rows in the result
 *   set.  For example, a SQL query like `"SELECT UserId, UserName FROM
 *   Users"` could return a `row_type` value like:
 *
 *       "fields": [
 *         { "name": "UserId", "type": { "code": "INT64" } },
 *         { "name": "UserName", "type": { "code": "STRING" } },
 *       ]
 *
 *   This object should have the same structure as [StructType]{@link google.spanner.v1.StructType}
 *
 * @property {Object} transaction
 *   If the read or SQL query began a transaction as a side-effect, the
 *   information about the new transaction is yielded here.
 *
 *   This object should have the same structure as [Transaction]{@link google.spanner.v1.Transaction}
 *
 * @typedef ResultSetMetadata
 * @memberof google.spanner.v1
 * @see [google.spanner.v1.ResultSetMetadata definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/spanner/v1/result_set.proto}
 */
const ResultSetMetadata = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Additional statistics about a ResultSet or PartialResultSet.
 *
 * @property {Object} queryPlan
 *   QueryPlan for the query associated with this result.
 *
 *   This object should have the same structure as [QueryPlan]{@link google.spanner.v1.QueryPlan}
 *
 * @property {Object} queryStats
 *   Aggregated statistics from the execution of the query. Only present when
 *   the query is profiled. For example, a query could return the statistics as
 *   follows:
 *
 *       {
 *         "rows_returned": "3",
 *         "elapsed_time": "1.22 secs",
 *         "cpu_time": "1.19 secs"
 *       }
 *
 *   This object should have the same structure as [Struct]{@link google.protobuf.Struct}
 *
 * @property {number} rowCountExact
 *   Standard DML returns an exact count of rows that were modified.
 *
 * @property {number} rowCountLowerBound
 *   Partitioned DML does not offer exactly-once semantics, so it
 *   returns a lower bound of the rows modified.
 *
 * @typedef ResultSetStats
 * @memberof google.spanner.v1
 * @see [google.spanner.v1.ResultSetStats definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/spanner/v1/result_set.proto}
 */
const ResultSetStats = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};