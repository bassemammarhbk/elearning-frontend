import React, { useEffect, useState } from 'react';
import { getfiliere, deletefiliere } from '../../../services/filiereservice';
import { CircularProgress } from '@mui/material';
import { Modal, Button } from 'react-bootstrap';
import AffichefiliereAdmin from './AffichefiliereAdmin';
import InsertfiliereAdmin from './InsertfiliereAdmin';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PrintIcon from '@mui/icons-material/Print';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListfiliereAdmin = () => {
    const [filieres, setFiliere] = useState([]);
    const [error, setError] = useState(null);
    const [isPending, setIspending] = useState(true);
    const [show, setShow] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleshow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleGetfilieres = async () => {
        try {
            const res = await getfiliere();
            setFiliere(res.data);
        } catch (error) {
            console.log(error);
            setError(error);
            toast.error('Erreur lors du chargement des filières');
        } finally {
            setIspending(false);
        }
    };

    useEffect(() => {
        handleGetfilieres();
    }, []);

    const handleAddFiliere = (newfil) => {
        setFiliere([newfil, ...filieres]);
        toast.success('Filière ajoutée avec succès');
    };

    const handleDeleteFiliere = (filiereId) => {
        setDeleteId(filiereId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deletefiliere(deleteId);
            setFiliere(filieres.filter((fil) => fil._id !== deleteId));
            setShowDeleteModal(false);
            setDeleteId(null);
            toast.success('Filière supprimée avec succès');
        } catch (error) {
            console.log(error);
            setError(error);
            toast.error('Erreur lors de la suppression de la filière');
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const handleUpdateFiliere = (filup) => {
        setFiliere(filieres.map((fil) => (fil._id === filup._id ? filup : fil)));
    };

    return (
        <div style={{ margin: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button
                    onClick={handleshow}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#218838',
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    <AddCircleIcon /> Ajouter une Filière
                </button>
                <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease, transform 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#0056b3',
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    <PrintIcon /> Imprimer
                </button>
            </div>

            {isPending ? (
                <div>
                    <CircularProgress color="primary" size={20} />
                </div>
            ) : error ? (
                <div>
                    Erreur dans le chargement
                </div>
            ) : (
                <div>
                    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Liste des Filières</h1>
                    <AffichefiliereAdmin
                        filieres={filieres}
                        handleDeleteFiliere={handleDeleteFiliere}
                        handleUpdateFiliere={handleUpdateFiliere}
                    />
                </div>
            )}

            {show && (
                <InsertfiliereAdmin
                    show={show}
                    handleAddFiliere={handleAddFiliere}
                    handleUpdateFiliere={handleUpdateFiliere}
                    handleClose={handleClose}
                />
            )}

            <Modal show={showDeleteModal} onHide={cancelDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer cette filière ? Cette action est irréversible.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
            />
        </div>
    );
};

export default ListfiliereAdmin;