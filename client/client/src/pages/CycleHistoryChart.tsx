import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/Appcontext';

const CycleHistoryChart = () => {
  const { user } = useAppContext();

  const isEligible = user?.gender?.toLowerCase() === 'female' && user?.useMenstrualTracker === true;

  if (!isEligible) return null;

  // Process data history array 
  const historicalData = user.cycleHistory || [];

  const formattedChartData = historicalData.map(cycle => {
    const dateObj = new Date(cycle.startDate);
    
    // Dynamic naming configurations
    const monthName = dateObj.toLocaleString('default', { month: 'short' });
    const dayDate = dateObj.getDate();
    const shortYear = dateObj.getFullYear().toString().substring(2);
    
    return {
      // 🌟 X-Axis mapping layout value structure (e.g., "Oct 12, 26")
      name: `${monthName} ${dayDate}, ${shortYear}`,
      days: cycle.durationInDays,
    };
  });

  return (
    <div className="p-6 mt-6 bg-white border shadow-sm dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
      <div className="mb-4">
        <h3 className="font-bold dark:text-slate-200">Menstrual Cycle Trends</h3>
        <p className="text-xs text-slate-400">Tracks changes in cycle durations over time</p>
      </div>
      
      <div className="w-full h-64">
        {formattedChartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-sm border-2 border-dashed text-slate-400 border-slate-100 dark:border-slate-800 rounded-2xl">
            No cycle history records detected yet. 
            <p className="mt-1 text-xs opacity-60">Log tracking points using the calendar engine.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
              
              {/* 🌟 Updated X-Axis tracking node representation mapping parameters directly */}
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8" 
                fontSize={10} 
                tickLine={false}
                dy={8}
              />
              
              <YAxis 
                stroke="#94A3B8" 
                fontSize={11} 
                tickLine={false} 
                domain={[0, 'dataMax + 5']}
                label={{ 
                  value: 'Days Count', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' } 
                }}
              />
              
              {/* 🌟 Added dynamic formatter rules ensuring explicit "Days" label value visibility inside container layout */}
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E293B', 
                  borderRadius: '12px', 
                  border: 'none', 
                  color: '#FFF', 
                  fontSize: '12px' 
                }}
                itemStyle={{ color: '#FB7185', fontWeight: 'bold' }}
                cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }}
                formatter={(value: any) => [`${value} Days`, "Cycle Length"]}
              />
              
              <Bar dataKey="days" fill="#FB7185" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CycleHistoryChart;
