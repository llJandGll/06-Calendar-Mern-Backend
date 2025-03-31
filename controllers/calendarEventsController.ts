import { Request, Response } from "express";
import Event from "../models/Event";
import { IJwtPayload } from "../interfaces/auth.interfaces";

export const getEvents = async (req: Request, res: Response) => {
  // obtener los eventos de la base de datos
  const events = await Event.find().populate('user', 'name email');
  if (!events) {
    return res.status(404).json({
      ok: false,
      msg: "No hay eventos"
    });
  }

  try {
    res.json({
      ok: true,
      msg: "Eventos obtenidos correctamente",
      events
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los eventos"
    });
  }


}

export const createEvent = async (req: Request, res: Response) => {
  const { body } = req;
  const user = req.user as IJwtPayload;

  try {
    const event = new Event({
      ...body,
      user: user.uid
    });
    
    const savedEvent = await event.save();

    res.json({
      ok: true,
      msg: "createEvent",
      event: savedEvent
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el evento",
    });
  }
}

export const updateEvent = async (req: Request, res: Response) => {
  const eventId = req.params.id;
  const { body } = req;
  const user = req.user as IJwtPayload;

  try {
    if (!eventId) {
      return res.status(400).json({
        ok: false,
        msg: "El id del evento es requerido"
      });
    }

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado"
      });
    }

    if (event.user.toString() !== user.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tienes permisos para actualizar este evento"
      });
    }

    const newEvent = {
      ...body,
      user: user.uid
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });
    
    res.json({
      ok: true,
      msg: "Evento actualizado correctamente",
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el evento"
    });
  }
}

export const deleteEvent = async (req: Request, res: Response) => {

  const eventId = req.params.id;
  const user = req.user as IJwtPayload;

  try {
    if (!eventId) {
      return res.status(400).json({
        ok: false,
        msg: "El id del evento es requerido"
      });
    }

    const event = await Event.findById(eventId);

    if ( !event ) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado"
      });
    }

    if ( event.user.toString() !== user.uid ) {
      return res.status(401).json({
        ok: false,
        msg: "No tienes permisos para eliminar este evento"
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    
    res.json({
      ok: true,
      msg: "Evento eliminado correctamente",
      event: deletedEvent
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar el evento"
    });
  }
}

