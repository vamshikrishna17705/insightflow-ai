import axios from "axios"
import { useState } from "react"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

function Upload() {

  const [data, setData] = useState(null)

  const [chartData, setChartData] = useState([])

  const [selectedColumn, setSelectedColumn] = useState("")

  const handleFileUpload = async (e) => {

    const file = e.target.files[0]

    const formData = new FormData()

    formData.append("file", file)

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      )

      setData(response.data)

      // Create chart data automatically

      if (
        response.data.numeric_columns.length > 0
      ) {

        const numericCol =
          response.data.numeric_columns[0]

        setSelectedColumn(numericCol)

        const generatedChartData =
          response.data.preview_data.map(
            (row, index) => ({
              name: `Row ${index + 1}`,
              value: row[numericCol]
            })
          )

        setChartData(generatedChartData)
      }

    } catch (error) {

      console.error(error)

      alert("Upload failed")

    }
  }

  return (

    <div className="mt-10">

      {/* Upload Box */}

      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">

        <h2 className="text-2xl font-bold mb-6">
          Upload Dataset
        </h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-slate-300"
        />

      </div>

      {/* Dataset Analytics */}

      {data && (

        <div className="mt-8 bg-slate-900 p-8 rounded-3xl border border-slate-800">

          <h2 className="text-2xl font-bold mb-6">
            Dataset Analytics
          </h2>

          <div className="space-y-4">

            <p>
              <span className="font-bold">
                Filename:
              </span>{" "}
              {data.filename}
            </p>

            <p>
              <span className="font-bold">
                Rows:
              </span>{" "}
              {data.rows}
            </p>

            <p>
              <span className="font-bold">
                Columns:
              </span>{" "}
              {data.columns}
            </p>

          </div>

        </div>

      )}

      {/* AI Insights */}

      {data?.insights && (

        <div className="mt-8 bg-slate-900 p-8 rounded-3xl border border-slate-800">

          <h2 className="text-2xl font-bold mb-6">
            AI Insights
          </h2>

          <div className="space-y-4">

            {data.insights.map((insight, index) => (

              <div
                key={index}
                className="bg-slate-800 p-4 rounded-2xl"
              >
                {insight}
              </div>

            ))}

          </div>

        </div>

      )}

      {/* Dynamic Charts */}

      {chartData.length > 0 && (

        <div className="mt-8 bg-slate-900 p-8 rounded-3xl border border-slate-800">

          <h2 className="text-2xl font-bold mb-8">
            Dynamic Analytics Chart
          </h2>

          <p className="mb-6 text-slate-400">
            Showing data for:
            <span className="ml-2 font-bold text-white">
              {selectedColumn}
            </span>
          </p>

          <div className="h-96">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      )}

    </div>

  )
}

export default Upload