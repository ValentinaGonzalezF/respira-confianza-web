import React from "react";
import { Link } from "react-router-dom";
import { getRequest } from "../../../utils/axios";
import {
  Button,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Paper,
} from "@material-ui/core";
import { Edit as EditIcon, Delete as DeleteIcon } from "@material-ui/icons";
import "./PollutantUmbrals.css";
import DeletePollutantUmbrals from "./delete/deletePollutantUmbrals";

class PollutantUmbrals extends React.Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    pollutantUmbrals: [],
    openModal: false,
    selectedPollutantUmbrals: null,
    columns: [
      { id: "pollutant", label: "Contaminante", minWidth: 270 },
      { id: "unit", label: "Unidad" },
      { id: "good", label: "Bueno" },
      { id: "moderate", label: "Moderado" },
      { id: "unhealthy", label: "No saludable" },
      { id: "very_unhealthy", label: "Muy insalubre" },
      { id: "dangerous", label: "Peligroso" },
    ],
  };
  async componentDidMount() {
    await this.getUmbrals();
  }

  getUmbrals = async () => {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/pollutant-umbrals`
    );
    if (response.status === 200) {
      this.setState({ pollutantUmbrals: response.data.pollutantUmbrals });
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ page: 0, rowsPerPage: +event.target.value });
  };

  handleDeleteClick = (value, selected) => {
    this.setState({ openModal: value, selectedPollutantUmbrals: selected });
  };

  render() {
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h2>Umbrales de Salud de los contaminantes</h2>
            <div className="Container__header_row_button">
              <Button
                color="secondary"
                variant="contained"
                component={Link}
                to="/admin/umbrales-contaminantes/nuevo"
              >
                + Nuevo umbral
              </Button>
            </div>
          </div>
        </div>
        {this.state.openModal ? (
          <DeletePollutantUmbrals
            openModal={this.state.openModal}
            handleDeleteClick={this.handleDeleteClick}
            pollutantUmbrals={this.state.selectedPollutantUmbrals}
            getUmbrals={this.getUmbrals}
          />
        ) : null}
        <Paper className="Paper_container">
          <TableContainer className="Table__container">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {this.state.columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell key={"admin"} style={{ minWidth: "170px" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.pollutantUmbrals
                  .slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage +
                    this.state.rowsPerPage
                  )
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {this.state.columns.map((column) => {
                          if (column.id === "unit") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {row["Pollutant"][column.id]}
                              </TableCell>
                            );
                          }
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                        <TableCell key="acciones" className="Action_buttons">
                          <IconButton
                            className="Edit__button"
                            to={`/admin/umbrales-contaminantes/${row.id}/editar/`}
                            component={Link}
                          >
                            <SvgIcon fontSize="small">
                              <EditIcon />
                            </SvgIcon>
                          </IconButton>
                          <IconButton
                            className="Delete__button"
                            onClick={() => this.handleDeleteClick(true, row)}
                          >
                            <SvgIcon fontSize="small">
                              <DeleteIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={this.state.pollutantUmbrals.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    );
  }
}

export default PollutantUmbrals;
