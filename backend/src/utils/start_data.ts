import models from "../models";

// const { Event, Competitor, DailyRev } = models;

const insertInitialData = async () => {
  // const competitorsData = [
  //   {
  //     "name": "La Teca de l'Àvia",
  //     "address": "C/Degà de Bahí, 5",
  //     "distance": "-",
  //     "offers": "Daily menu during weekdays, and rotisserie chicken on Thursdays and weekends. Homemade food.",
  //     "price": "€",
  //     "hours": "Open every day except Sundays and Monday afternoons.",
  //     "color": "bg-yellow-100",
  //     "latitude": 41.410932953977984, 
  //     "longitude": 2.1829122818595765
  //   },
    
  // ];

  // //Insertar datos con opción ignoreDuplicates
  // //Para actualizar todas las filas: updateOnDuplicate: Object.keys(User.rawAttributes)
  // await Competitor.bulkCreate(competitorsData, { ignoreDuplicates: true });

  // const holidayEventsData = [
  //   { title: 'Año Nuevo', date: '2025-01-01', color: '#fbc02d' },
    
  // ];

  // await Event.bulkCreate(holidayEventsData, { ignoreDuplicates: true });

  // const dailyRevenueData = [
  //   { title: 'Daily Revenue - 2024-12-01', date: '2024-12-01', total_sales: 2797.92, total_clients: 163, closed: false, weekday_id: 7, bank_holiday: false },
    
  // ];

  // await DailyRev.bulkCreate(dailyRevenueData, {ignoreDuplicates:true});
}

export { insertInitialData };