class Room {

    constructor(name,bookings,rate,discount){

        this.name = name
        this.bookings = bookings
        this.rate = rate
        this.discount = discount

    }

    isOccupied(date){

            const dateDataSplitted = date.split('/')

            if((dateDataSplitted[0] > 31 || dateDataSplitted[0] < 1 ) || (dateDataSplitted[1] > 12 || dateDataSplitted[1]) < 1){
            
                throw new TypeError('El formato de fecha es incorrecto')
            }

            const dateFormatted = new Date(parseInt(dateDataSplitted[2]),parseInt(dateDataSplitted[1])-1,parseInt(dateDataSplitted[0]))

            for (const booking of this.bookings) {

                let checkInData = booking.checkIn.split('/')
                let checkOutData = booking.checkOut.split('/')

                let checkIn = new Date(parseInt(checkInData[2]),parseInt(checkInData[1])-1,parseInt(checkInData[0]))
                let checkOut = new Date(parseInt(checkOutData[2]),parseInt(checkOutData[1])-1,parseInt(checkOutData[0]))

                if(checkIn <= dateFormatted  && dateFormatted <= checkOut){
                    return true

                }
                
            }

            return false

        
    }

    occupancyPercentage(startDate,endDate){

        const startDateData = startDate.split('/')
        const startDateFormatted = new Date(parseInt(startDateData[2]),parseInt(startDateData[1])-1,parseInt(startDateData[0]));

        const endDateData = endDate.split('/')
        const endDateFormatted = new Date(parseInt(endDateData[2]),parseInt(endDateData[1])-1,parseInt(endDateData[0]));


        let totalDaysOccupied = 0

        const totalDays = Math.round((endDateFormatted-startDateFormatted) / (24 * 3600 * 1000)+1)

        for (const booking of this.bookings) {

            const checkInData = booking.checkIn.split('/')
            const checkOutData = booking.checkOut.split('/')

            const checkIn = new Date(parseInt(checkInData[2]),parseInt(checkInData[1])-1,parseInt(checkInData[0]))
            const checkOut = new Date(parseInt(checkOutData[2]),parseInt(checkOutData[1])-1,parseInt(checkOutData[0]))

            // Condición para comprobar si el rango de startDate y endDate está fuera de checkIn y checkOut
            if(checkIn <= endDateFormatted && checkOut >= startDateFormatted){

                if(startDateFormatted <= checkIn && endDateFormatted >= checkOut){

                    totalDaysOccupied += Math.round((checkOut-checkIn) / (24 * 3600 * 1000)+1)
    
                }
                else if(startDateFormatted <= checkIn && endDateFormatted < checkOut){
    
                    totalDaysOccupied += Math.round((endDateFormatted-checkIn) / (24 * 3600 * 1000)+1)
                }
                else if(startDateFormatted > checkIn && endDateFormatted >= checkOut){

                    totalDaysOccupied += Math.round((checkOut-startDateFormatted) / (24 * 3600 * 1000)+1)
                }

                else if(startDateFormatted > checkIn && endDateFormatted < checkOut){
                    totalDaysOccupied = totalDays
                    break
                }
            }
          
        }
        
        return ( totalDaysOccupied / totalDays ) * 100

    }

    static totalOccupancyPercentage(rooms,startDate,endDate){

        const startDateData = startDate.split('/')
        const startDateFormatted = new Date(parseInt(startDateData[2]),parseInt(startDateData[1])-1,parseInt(startDateData[0]));

        const endDateData = endDate.split('/')
        const endDateFormatted = new Date(parseInt(endDateData[2]),parseInt(endDateData[1])-1,parseInt(endDateData[0]));

        let roomsPercentage = 0;

        // total de días a calcular
        const totalDays = Math.round((endDateFormatted-startDateFormatted) / (24 * 3600 * 1000)+1)

        // iteración del rango de fechas
        while (startDateFormatted <= endDateFormatted) {
            
            let countRoomOcupied = 0;
            // iteración de las habitaciones en cada día
            for (const room of rooms) {

                const roomInstance = new Room(room.name,room.bookings,room.rate,room.discount)
                
                // comprobar si esta habitación está ocupada en ese día
                if(roomInstance.isOccupied(startDate)){
                    countRoomOcupied++
                }

            }
            // Calcular el porcentaje de la ocupación de todas las habitaciones en ese día y
            // y acumular en roomsPercentage para hacer el promedio total de las habitaciones
            roomsPercentage += (countRoomOcupied / rooms.length ) * 100

            startDateFormatted.setDate(startDateFormatted.getDate()+1)
            startDate = `${startDateFormatted.getDate()}/${startDateFormatted.getMonth()+1}/${startDateFormatted.getFullYear()}`
            
        }
        // devolver el promedio de toda la ocupación que hay de todas las habitaciones en el rango de esos días
        return  Math.round(roomsPercentage / totalDays)

    }

    static availableRooms(rooms,startDate,endDate){

        const roomsAvailable = []

        for (const room of rooms) {

            const roomInstance = new Room(room.name,room.bookings,room.rate,room.discount)

            if(roomInstance.occupancyPercentage(startDate,endDate) === 0){
                
                roomsAvailable.push(room.name)
            }
        }

        return roomsAvailable
    }
}

class Booking {

    constructor(name,email,checkIn,checkOut,discount,room){

        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }

    getFee(){

        let feeDiscount = this.room.rate - ( this.room.rate * (this.discount / 100))

        feeDiscount -= feeDiscount * (this.room.discount / 100)

        return feeDiscount
    }
}




module.exports = { Room, Booking };