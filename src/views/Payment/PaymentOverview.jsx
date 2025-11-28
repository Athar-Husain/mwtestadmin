import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Paper, Divider } from '@mui/material';
import ReactApexChart from 'react-apexcharts'; // Import the ApexCharts component

const PaymentsOverview = () => {
    const [chartData, setChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [barChartData, setBarChartData] = useState(null);

    // Dummy Data for Payments Overview
    const paymentStats = {
        totalPayments: 150000,
        pendingPayments: 5000,
        failedPayments: 2000,
    };

    // Chart Data for Payment History
    useEffect(() => {
        // Check if the chart data is available
        const chartOptions = {
            options: {
                chart: {
                    id: 'payment-history-chart',
                    toolbar: {
                        show: false, // Disable the toolbar for better UI
                    },
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Months
                },
                yaxis: {
                    title: {
                        text: 'Total Payments ($)',
                    },
                },
                title: {
                    text: 'Payments Over Time',
                    align: 'center',
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                    },
                },
                grid: {
                    borderColor: '#f1f1f1',
                },
                stroke: {
                    curve: 'smooth',
                },
            },
            series: [
                {
                    name: 'Payments',
                    data: [12000, 18000, 15000, 20000, 25000, 30000], // Payment data
                },
            ],
        };

        const pieChartOptions = {
            options: {
                chart: {
                    id: 'payment-methods-pie',
                },
                labels: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'],
                legend: {
                    position: 'bottom',
                    labels: {
                        colors: '#333',
                        fontSize: '14px',
                    },
                },
            },
            series: [40, 30, 20, 10], // Data representing percentage for each payment method
        };

        const barChartOptions = {
            options: {
                chart: {
                    id: 'payment-status-bar',
                    toolbar: {
                        show: false,
                    },
                },
                xaxis: {
                    categories: ['January', 'February', 'March', 'April', 'May'],
                },
                title: {
                    text: 'Payments Status',
                    align: 'center',
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                    },
                },
                grid: {
                    borderColor: '#f1f1f1',
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '40%',
                        borderRadius: 5,
                    },
                },
            },
            series: [
                {
                    name: 'Successful Payments',
                    data: [80, 120, 150, 180, 200], // Successful payment counts
                },
                {
                    name: 'Failed Payments',
                    data: [5, 10, 8, 3, 2], // Failed payment counts
                },
            ],
        };

        // Set data once fetched/created
        setChartData(chartOptions);
        setPieChartData(pieChartOptions);
        setBarChartData(barChartOptions);
    }, []);

    // Check if the data for the charts has been set
    if (!chartData || !pieChartData || !barChartData) {
        return <Typography variant="h6">Loading chart data...</Typography>;
    }

    return (
        <Box >
            <Typography variant="h4" gutterBottom align="center" color="primary">
                Payments Overview
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} >
                <Grid item xs={12} sm={8} >
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Total Payments
                            </Typography>
                            <Typography variant="h4" color="primary">
                                ${paymentStats.totalPayments.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Pending Payments
                            </Typography>
                            <Typography variant="h4" color="warning.main">
                                ${paymentStats.pendingPayments.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Failed Payments
                            </Typography>
                            <Typography variant="h4" color="error.main">
                                ${paymentStats.failedPayments.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid spacing={4} container sx={{ mt: 4, }}>
                {/* Payment History Chart */}
                <Grid item xs={12} sm={12} >
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Payment History
                        </Typography>
                        <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 2 }}>
                            <ReactApexChart
                                options={chartData.options}
                                series={chartData.series}
                                type="line"
                                height={350}
                            />
                        </Paper>
                    </Box>
                </Grid>

                {/* Payment Methods Distribution (Pie Chart) */}
                <Grid item xs={12} sm={12} md={6} >
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Payment Methods Distribution
                        </Typography>
                        <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 2 }}>
                            <ReactApexChart
                                options={pieChartData.options}
                                series={pieChartData.series}
                                type="pie"
                                height={350}
                            />
                        </Paper>
                    </Box>
                </Grid>
            </Grid>


            <Divider sx={{ my: 4 }} />

            {/* Bar Chart */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Payments Status
                </Typography>
                <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 2 }}>
                    <ReactApexChart
                        options={barChartData.options}
                        series={barChartData.series}
                        type="bar"
                        height={350}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default PaymentsOverview;
