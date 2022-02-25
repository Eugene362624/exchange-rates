import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import {
    Refresh as RefreshIcon
} from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import './MainPage.scss'
import axios from 'axios'

function MainPage({favoriteCurr}) {

    const [favCurrData, setFavCurrData] = useState([])

    useEffect(() => {
        console.log(favoriteCurr)
        getRates()
    }, [])

    const getRates = () => {
        favoriteCurr.forEach(e => {
            axios.get(`https://www.nbrb.by/api/exrates/rates/${e.Cur_Code}?parammode=1`)
            .then(res => setFavCurrData(data => data.concat(res.data)))
        })
    }

    console.log(favCurrData)

  return (
    <div className='app-inner'>
        <Paper>
            <IconButton>
                <RefreshIcon/>
            </IconButton>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {favCurrData && favCurrData.map((curr, i) => {return <Row key={i} curr={curr}></Row>})}
                </TableBody>
            </Table>
        </Paper>
    </div>
  )
}

export default MainPage

const Row = ({curr}) => {
    return (
        <TableRow>
            <TableCell>{curr.Date}</TableCell>
            <TableCell>{curr.Cur_Name}</TableCell>
            <TableCell>{curr.Cur_Code}</TableCell>
            <TableCell>{curr.Cur_OfficialRate}</TableCell>
            <TableCell></TableCell>
        </TableRow>
    )
}