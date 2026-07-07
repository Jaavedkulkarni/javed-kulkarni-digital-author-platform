import { memo, useState } from 'react';
import { useRoles } from '../../../context/RoleContext';
import { useOrganizationServices } from '../../../organization/hooks/useOrganizationServices';
import { AlertCircle, Building2, FileText, Briefcase, CheckCircle2 } from 'lucide-react';
import { inputCls } from '../../../pages/reader/ReaderAuthShell';

type WizardStep = 'company' | 'business' | 'documents' | 'review';

export interface PublisherRegistrationWizardProps {
  onSubmitted: () => void;
  onCancel?: () => void;
}

interface CompanyForm {
  companyName: string;
  legalName: string;
  contactEmail: string;
  contactPhone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
}

interface BusinessForm {
  gstin: string;
  pan: string;
  maxBooksPerMonth: string;
  specializations: string;
  printingMachines: string;
}

interface DocumentsForm {
  gstCertificate: string;
  panCard: string;
  companyRegistration: string;
  acceptTerms: boolean;
}

const STEPS: { id: WizardStep; label: string; icon: typeof Building2 }[] = [
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'review', label: 'Submit', icon: CheckCircle2 },
];

export const PublisherRegistrationWizard = memo(function PublisherRegistrationWizard({
  onSubmitted,
  onCancel,
}: PublisherRegistrationWizardProps) {
  const { profile } = useRoles();
  const { organizations, verification } = useOrganizationServices();
  const [step, setStep] = useState<WizardStep>('company');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState<CompanyForm>({
    companyName: '',
    legalName: '',
    contactEmail: profile?.email ?? '',
    contactPhone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [business, setBusiness] = useState<BusinessForm>({
    gstin: '',
    pan: '',
    maxBooksPerMonth: '',
    specializations: '',
    printingMachines: '',
  });

  const [documents, setDocuments] = useState<DocumentsForm>({
    gstCertificate: '',
    panCard: '',
    companyRegistration: '',
    acceptTerms: false,
  });

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const validateCompany = (): boolean => {
    if (!company.companyName.trim()) {
      setError('Company name is required.');
      return false;
    }
    if (!company.contactEmail.trim()) {
      setError('Contact email is required.');
      return false;
    }
    return true;
  };

  const validateBusiness = (): boolean => {
    if (!business.gstin.trim() && !business.pan.trim()) {
      setError('Provide at least GSTIN or PAN.');
      return false;
    }
    return true;
  };

  const validateDocuments = (): boolean => {
    if (!documents.acceptTerms) {
      setError('You must accept the terms to submit.');
      return false;
    }
    return true;
  };

  const goNext = () => {
    setError(null);
    if (step === 'company' && !validateCompany()) return;
    if (step === 'business' && !validateBusiness()) return;
    if (step === 'documents' && !validateDocuments()) return;
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  };

  const goBack = () => {
    setError(null);
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  };

  const handleSubmit = async () => {
    if (!profile?.id) {
      setError('Sign in required.');
      return;
    }
    if (!validateDocuments()) return;

    setLoading(true);
    setError(null);

    try {
      const orgResult = await organizations.create({
        name: company.companyName.trim(),
        type: 'publisher_company',
        ownerId: profile.id,
        settings: {
          locale: 'en',
          timezone: 'Asia/Kolkata',
        },
      });

      if (!orgResult.success) {
        setError(orgResult.errors?.join(' ') ?? 'Could not create organization.');
        return;
      }

      const approvalResult = await verification.submitPublisherRegistration(
        profile.id,
        orgResult.data?.id ?? null,
      );

      if (!approvalResult.success) {
        setError(approvalResult.errors?.join(' ') ?? 'Could not submit registration.');
        return;
      }

      onSubmitted();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                i <= stepIndex
                  ? 'bg-gold-500 text-navy-900'
                  : 'bg-navy-700 text-gray-500 border border-navy-600'
              }`}
            >
              {i + 1}
            </div>
            <span className="text-[10px] text-gray-500 hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {step === 'company' && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Company Information</h3>
          <input
            type="text"
            placeholder="Company Name *"
            value={company.companyName}
            onChange={(e) => setCompany((c) => ({ ...c, companyName: e.target.value }))}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Legal Name"
            value={company.legalName}
            onChange={(e) => setCompany((c) => ({ ...c, legalName: e.target.value }))}
            className={inputCls}
          />
          <input
            type="email"
            placeholder="Contact Email *"
            value={company.contactEmail}
            onChange={(e) => setCompany((c) => ({ ...c, contactEmail: e.target.value }))}
            className={inputCls}
          />
          <input
            type="tel"
            placeholder="Contact Phone"
            value={company.contactPhone}
            onChange={(e) => setCompany((c) => ({ ...c, contactPhone: e.target.value }))}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Address"
            value={company.addressLine1}
            onChange={(e) => setCompany((c) => ({ ...c, addressLine1: e.target.value }))}
            className={inputCls}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City"
              value={company.city}
              onChange={(e) => setCompany((c) => ({ ...c, city: e.target.value }))}
              className={inputCls}
            />
            <input
              type="text"
              placeholder="State"
              value={company.state}
              onChange={(e) => setCompany((c) => ({ ...c, state: e.target.value }))}
              className={inputCls}
            />
          </div>
          <input
            type="text"
            placeholder="Postal Code"
            value={company.postalCode}
            onChange={(e) => setCompany((c) => ({ ...c, postalCode: e.target.value }))}
            className={inputCls}
          />
        </div>
      )}

      {step === 'business' && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Business Details</h3>
          <input
            type="text"
            placeholder="GSTIN"
            value={business.gstin}
            onChange={(e) => setBusiness((b) => ({ ...b, gstin: e.target.value }))}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="PAN"
            value={business.pan}
            onChange={(e) => setBusiness((b) => ({ ...b, pan: e.target.value }))}
            className={inputCls}
          />
          <input
            type="number"
            placeholder="Max books per month"
            value={business.maxBooksPerMonth}
            onChange={(e) => setBusiness((b) => ({ ...b, maxBooksPerMonth: e.target.value }))}
            className={inputCls}
            min={0}
          />
          <input
            type="text"
            placeholder="Specializations (comma-separated)"
            value={business.specializations}
            onChange={(e) => setBusiness((b) => ({ ...b, specializations: e.target.value }))}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Printing machines (comma-separated)"
            value={business.printingMachines}
            onChange={(e) => setBusiness((b) => ({ ...b, printingMachines: e.target.value }))}
            className={inputCls}
          />
        </div>
      )}

      {step === 'documents' && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Documents</h3>
          <p className="text-xs text-gray-500">Provide document reference numbers or file names for verification.</p>
          <input
            type="text"
            placeholder="GST Certificate reference"
            value={documents.gstCertificate}
            onChange={(e) => setDocuments((d) => ({ ...d, gstCertificate: e.target.value }))}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="PAN Card reference"
            value={documents.panCard}
            onChange={(e) => setDocuments((d) => ({ ...d, panCard: e.target.value }))}
            className={inputCls}
          />
          <input
            type="text"
            placeholder="Company Registration reference"
            value={documents.companyRegistration}
            onChange={(e) => setDocuments((d) => ({ ...d, companyRegistration: e.target.value }))}
            className={inputCls}
          />
          <label className="flex items-start gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={documents.acceptTerms}
              onChange={(e) => setDocuments((d) => ({ ...d, acceptTerms: e.target.checked }))}
              className="mt-1 rounded border-navy-600"
            />
            <span>I accept the publisher terms and confirm the information provided is accurate.</span>
          </label>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-3 text-sm">
          <h3 className="font-medium text-white">Review & Submit</h3>
          <div className="rounded-lg border border-navy-700 bg-navy-900/50 p-3 space-y-2 text-gray-300">
            <p><span className="text-gray-500">Company:</span> {company.companyName}</p>
            <p><span className="text-gray-500">Email:</span> {company.contactEmail}</p>
            <p><span className="text-gray-500">GSTIN:</span> {business.gstin || '—'}</p>
            <p><span className="text-gray-500">PAN:</span> {business.pan || '—'}</p>
          </div>
          <p className="text-xs text-gray-500">
            After submission, your application will be reviewed by our team.
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="flex-1 py-3 rounded-lg border border-navy-600 text-gray-300 hover:bg-navy-700 disabled:opacity-50"
          >
            Back
          </button>
        )}
        {step !== 'review' ? (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-gold-500 text-navy-900 font-semibold hover:bg-gold-400 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        )}
      </div>

      {onCancel && (
        <button type="button" onClick={onCancel} className="w-full py-2 text-sm text-gray-400 hover:text-gray-300">
          Cancel
        </button>
      )}
    </div>
  );
});

export default PublisherRegistrationWizard;
